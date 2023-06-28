using System;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Linq.Expressions;
using UnityEngine;
using UnityEngine.SceneManagement;
using easyar;
using TMPro;
using UnityEngine.UI;
using UnityEngine.Android;
using UnityEngine.Events;

public class MultipleCtrl : MonoBehaviour
{
    [Serializable]
    public class ImageFile
    {
        public string image;
        public string name;
        public float scale = 0.1f;
    }

    [Serializable]
    public class ImageJson
    {
        public List<ImageFile> images = new List<ImageFile>();
        //public UnityEvent TargetFound;
        //public UnityEvent TargetLost;
    }

    public ARSession Session;
    public List<GameObject> imageTargetControllerObjs = new List<GameObject>();
    private ImageJson imageJsons;

    private Dictionary<ImageTargetController, bool> imageTargetControllers =
        new Dictionary<ImageTargetController, bool>();

    private ImageTrackerFrameFilter imageTracker;

    public GameObject Loading;

    // public Text loadProgress;
    private float sceneLoadingRate = 0;

    private int id = -1;

    // public Text idTxt;
    private bool debug = false;

    //public Button backBtn;
    //public Texture2D[] guidList;
    public GameObject guid;
    public TextMeshProUGUI tipTxt;
    public Button recogBtn;

    public TextAsset PicJson;
    public TextAsset EtdJson;

    public Boolean USEETD = false;
    //public Texture2D guidTex;


    //private string[] txtList = { "AR0����","AR1����", "AR2����", "AR3����", "AR4����" };

    private void Awake()
    {
        imageJsons = JsonUtility.FromJson<ImageJson>(USEETD ? EtdJson.text : PicJson.text);
        imageTracker = Session.GetComponentInChildren<ImageTrackerFrameFilter>();
        imageTracker.enabled = false;
        guid.SetActive(false);
        //id = GetStartID();
        //if (id != -1)
        //{
        //    CreateTargetsIndex(0);
        //    if (id>=0 && id< txtList.Length)
        //    {
        //        //guid.GetComponent<RawImage>().texture = guidTex;//guidList[id];
        //        tipTxt.text = txtList[id];
        //        //imageTracker.gameObject.SetActive(false);
        //    }
        //    guid.SetActive(true);
        //    imageTracker.enabled = false;
        //}
        id = ConfigManager.Instance.getStartId();
        string tip = ConfigManager.Instance.getARTip();
        if (tip != "")
        {
            CreateTargetsIndex(0);
            tipTxt.text = tip;
            guid.SetActive(true);
        }

        if (debug)
        {
            // idTxt.gameObject.SetActive(debug);
            //idTxt.text = id.ToString();
        }

        Loading.SetActive(false);
    }

    void Start()
    {
        //backBtn.onClick.AddListener(
        //    delegate
        //    {
        //        Application.Quit();
        //    });


        recogBtn.onClick.AddListener(
            delegate
            {
                guid.SetActive(false);
                //imageTracker.gameObject.SetActive(true);
                imageTracker.enabled = true;
            });
    }

    public void CreateTargetsIndex(int index)
    {
        ClearImageTargetControllers();
        CreateTargets(imageJsons);
    }

    public void ClearImageTargetControllers()
    {
        foreach (var item in imageTargetControllerObjs)
        {
            Destroy(item);
        }

        imageTargetControllerObjs.Clear();
    }

    public void Tracking(bool on)
    {
        imageTracker.enabled = on;
    }

    private void CreateTargets(ImageJson imageJson)
    {
        var targetController = new ImageTargetController();
        foreach (var image in imageJson.images)
        {
            targetController = CreateTargetNode("ImageTarget-" + image.name, imageJson);
            targetController.Tracker = imageTracker;
            if (!USEETD)
            {
                targetController.ImageFileSource.PathType = PathType.StreamingAssets;
                targetController.ImageFileSource.Path = image.image;
                targetController.ImageFileSource.Name = image.name;
                targetController.ImageFileSource.Scale = image.scale;
                targetController.SourceType = ImageTargetController.DataSource.ImageFile;
            }
            else
            {
                targetController.TargetDataFileSource.Path = image.name + ".etd";
                targetController.TargetDataFileSource.PathType = PathType.StreamingAssets;
                targetController.SourceType = ImageTargetController.DataSource.TargetDataFile;
            }

            imageTargetControllerObjs.Add(targetController.gameObject);
            //var duck03 = Instantiate(Resources.Load("duck03")) as GameObject;
            //duck03.transform.parent = targetController.gameObject.transform;
        }
    }

    private ImageTargetController CreateTargetNode(string targetName, ImageJson imageJson)
    {
        GameObject go = new GameObject(targetName);
        var targetController = go.AddComponent<ImageTargetController>();
        AddTargetControllerEvents(targetController, imageJson);
        imageTargetControllers[targetController] = false;
        return targetController;
    }

    private void AddTargetControllerEvents(ImageTargetController controller, ImageJson imageJson)
    {
        if (!controller)
        {
            return;
        }

        controller.TargetFound += () =>
        {
            //imageJson.TargetFound.Invoke();
            if (asyncOperation == null)
            {
                Loading.SetActive(true);
                StartCoroutine(LoadScene("AR_" + id, LoadSceneMode.Single));
            }

            Debug.LogFormat("Found target {{id = {0}, name = {1}}}", controller.Target.runtimeID(),
                controller.Target.name());
        };
        controller.TargetLost += () =>
        {
            //imageJson.TargetLost.Invoke();
            Debug.LogFormat("Lost target {{id = {0}, name = {1}}}", controller.Target.runtimeID(),
                controller.Target.name());
        };
        controller.TargetLoad += (Target target, bool status) =>
        {
            imageTargetControllers[controller] = status ? true : imageTargetControllers[controller];
            Debug.LogFormat("Load target {{id = {0}, name = {1}, size = {2}}} into {3} => {4}", target.runtimeID(),
                target.name(), controller.Size, controller.Tracker.name, status);
        };
        controller.TargetUnload += (Target target, bool status) =>
        {
            imageTargetControllers[controller] = status ? false : imageTargetControllers[controller];
            Debug.LogFormat("Unload target {{id = {0}, name = {1}}} => {2}", target.runtimeID(), target.name(), status);
        };
    }

//    public int GetStartID()
//    {
//        //log.text = log.text + "��ʼ��ȡText�ı�����";

//        int result = -1;
//#if UNITY_EDITOR
//        // �������ز���ʹ��
//        string filepath = Application.streamingAssetsPath + "/unity.txt";
//#elif UNITY_ANDROID
//	    // ����ʱʹ��
//        string filepath = "/sdcard/unity.txt";
//#elif UNITY_IOS
//        // ����ʱʹ��
//        string filepath = Application.streamingAssetsPath + "/unity.txt";
//#endif
//        if (File.Exists(filepath))
//        {
//            Debug.Log("Find");
//            try
//            {
//                result = int.Parse(File.ReadAllText(filepath));
//            }
//            catch (Exception e)
//            {
//                Debug.Log("����" + e.ToString());
//                throw;
//            }

//            Debug.Log("��ȡ�� Text �ı����ݣ�" + result);
//            return result;
//        }
//        else
//        {
//            Debug.Log("Not Find");
//        }

//        return result;
//    }
    private AsyncOperation asyncOperation;

    IEnumerator<AsyncOperation> LoadScene(string name, LoadSceneMode mode)
    {
        asyncOperation = SceneManager.LoadSceneAsync(name, mode);
        asyncOperation.allowSceneActivation = false;

        while (!asyncOperation.isDone)
        {
            if (asyncOperation.progress < 0.9f)
                sceneLoadingRate = asyncOperation.progress;
            else
                sceneLoadingRate = 1.0f;

            // loadProgress.text = "Loading��" + (int) (sceneLoadingRate * 100) + " %";

            if (sceneLoadingRate >= 0.9)
            {
                asyncOperation.allowSceneActivation = true;
            }

            yield return null;
        }
    }
}